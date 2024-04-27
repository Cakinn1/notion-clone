"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, MenuIcon, PlusCircle, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";

export default function Navigation() {
  const pathname = usePathname();
  const isMoblie = useMediaQuery("(max-width: 768px)");
  const documents = useQuery(api.documents.get);
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isRestting, setIsRestting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMoblie);

  useEffect(() => {
    if (isMoblie) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMoblie]);

  useEffect(() => {
    if (isMoblie) {
      collapse();
    }
  }, [pathname, isMoblie]);

  function handleMouseDown(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  }

  function handleMouseUp() {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  function resetWidth() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsRestting(true);
      sidebarRef.current.style.width = isMoblie ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMoblie ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMoblie ? "100%" : "240px");
      setTimeout(() => {
        setIsRestting(false);
      }, 300);
    }
  }

  function collapse() {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsRestting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsRestting(false), 300);
    }
  }

  const handleCreate = () => {
    const promise = create({title: "Untitled"})
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]`,
          isRestting && "transition-all ease-in-out duration-300",
          isMoblie && "w-0"
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMoblie && "opacity-100"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item onClick={() => {}} label="Search" icon={Search} isSearch={true} />
          <Item onClick={() => {}} label="Setting" icon={Settings}  />
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          {documents?.map((document) => (
            <p key={document._id}>{document.title}</p>
          ))}
        </div>
        <div
          onMouseDown={(event) => handleMouseDown(event)}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0 "
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isRestting && "transition-all ease-in-out duration-300",
          isMoblie && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
}
