import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#home", route: "/" },
  { label: "About Us", href: "#about", route: "/about" },
  // { label: "Schedule", href: "#schedule", route: "/schedule" },
  { label: "Sponsors", href: "#sponsors", route: "/sponsorship" },
  { label: "Past Summits", href: "#past-summits", route: "/past-summits" },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

const sortSectionsByDOMOrder = (a: string, b: string) =>
  sectionIds.indexOf(a) - sectionIds.indexOf(b);

const Navbar = memo(() => {
  const [scrolled, setScrolled] = useState(() =>
    globalThis.window === undefined ? false : globalThis.window.scrollY > 20,
  );
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const scrollFrameRef = useRef<number>();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const updateScrolled = useCallback(() => {
    setScrolled((current) => {
      const next = globalThis.window.scrollY > 20;
      return current === next ? current : next;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = undefined;
        updateScrolled();
      });
    };

    globalThis.window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, [updateScrolled]);

  useEffect(() => {
    if (!isHome) return;

    const visibleSections = new Set<string>();
    let observer: IntersectionObserver | null = null;
    const observedElements = new Set<HTMLElement>();

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      let changed = false;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
          changed = true;
        } else if (visibleSections.has(entry.target.id)) {
          visibleSections.delete(entry.target.id);
          changed = true;
        }
      }

      if (changed && visibleSections.size > 0) {
        const sorted = Array.from(visibleSections).sort(sortSectionsByDOMOrder);
        setActiveSection(sorted[0]);
      }
    };

    const observeSections = () => {
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));

      observer ??= new IntersectionObserver(handleIntersection, {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      });

      sections.forEach((section) => {
        if (!observedElements.has(section)) {
          observer.observe(section);
          observedElements.add(section);
        }
      });
    };

    observeSections();

    let debounceTimer: ReturnType<typeof setTimeout>;
    const debouncedObserveSections = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(observeSections, 100);
    };

    const mutationObserver = new MutationObserver(debouncedObserveSections);

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (observer) observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(debounceTimer);
      visibleSections.clear();
      observedElements.clear();
    };
  }, [isHome]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    e.preventDefault();

    // Standalone pages — navigate directly
    if (
      link.route === "/about" ||
      link.route === "/schedule" ||
      link.route === "/sponsorship" ||
      link.route === "/past-summits"
    ) {
      navigate(link.route);
      setOpen(false);
      return;
    }

    // If on home page, smooth scroll
    if (isHome) {
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home then scroll
      navigate(link.route);
    }
    setOpen(false);
  };

  const isActive = (link: (typeof navLinks)[0]) => {
    if (link.route === "/about") return location.pathname === "/about";
    // if (link.route === "/schedule") return location.pathname === "/schedule";
    if (link.route === "/sponsorship") return location.pathname === "/sponsorship";
    if (link.route === "/past-summits") return location.pathname === "/past-summits";
    if (!isHome) return false;
    return activeSection === link.href.slice(1);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16 md:h-20">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            setOpen(false);
          }}
          className="flex items-center gap-2"
          aria-label="Africa DevOps Summit home"
        >
          <img
            src="https://res.cloudinary.com/nairobidevops/image/upload/v1778759087/Updated_ADS_logo_jo105p.png"
            alt="Africa DevOps Summit Logo"
            width="180"
            height="44"
            className="h-9 w-[147px] md:h-11 md:w-[180px] object-contain transition-transform duration-300 hover:scale-105 origin-left"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => {
            const active = isActive(l);
            const textColor = scrolled ? "text-foreground" : "text-primary-foreground";
            const afterScale = active
              ? "after:scale-x-100 after:origin-left"
              : `after:scale-x-0 ${textColor}`;
            const activeClass = active ? "text-primary" : "";

            return (
              <a
                key={l.label}
                href={l.route}
                onClick={(e) => handleClick(e, l)}
                className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left ${activeClass} ${afterScale}`}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/#tickets"
            onClick={(e) => {
              e.preventDefault();
              if (isHome) {
                document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/#tickets");
              }
            }}
            className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            aria-label="Get Your Tickets"
          >
            Get Your Tickets
          </a>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className={scrolled ? "text-foreground" : "text-primary-foreground"} />
            ) : (
              <Menu className={scrolled ? "text-foreground" : "text-primary-foreground"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((l) => {
              const active = isActive(l);
              return (
                <a
                  key={l.label}
                  href={l.route}
                  className={`font-medium text-base transition-colors ${active ? "text-primary" : "text-foreground hover:text-primary"}`}
                  onClick={(e) => handleClick(e, l)}
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href="/#tickets"
              className="mt-2 inline-flex justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
              onClick={(e) => {
                e.preventDefault();
                if (isHome) {
                  document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#tickets");
                }
                setOpen(false);
              }}
            >
              Get Your Tickets
            </a>
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
