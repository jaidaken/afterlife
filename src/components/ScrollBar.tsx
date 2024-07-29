import React, { useRef, useEffect, useState } from 'react';

interface ScrollBarProps {
  children: React.ReactNode;
}

const ScrollBar: React.FC<ScrollBarProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTop, setStartTop] = useState(0);

  const recalculateScrollbar = () => {
    if (containerRef.current && scrollbarRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = containerRef.current.scrollHeight;
      const scrollbarHeight = (containerHeight / contentHeight) * containerHeight;
      scrollbarRef.current.style.height = `${scrollbarHeight}px`;
      scrollbarRef.current.style.display = contentHeight > containerHeight ? 'block' : 'none';
    }
  };

  useEffect(() => {
    recalculateScrollbar();
    window.addEventListener('resize', recalculateScrollbar);
    return () => {
      window.removeEventListener('resize', recalculateScrollbar);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current && scrollbarRef.current) {
        const deltaY = e.clientY - startY;
        const newTop = Math.min(
          containerRef.current.clientHeight - scrollbarRef.current.clientHeight,
          Math.max(0, startTop + deltaY)
        );
        scrollbarRef.current.style.top = `${newTop}px`;
        containerRef.current.scrollTop = (newTop / containerRef.current.clientHeight) * containerRef.current.scrollHeight;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove('no-select');
      scrollbarRef.current?.classList.remove('dragging');
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY, startTop]);

  useEffect(() => {
    const observer = new MutationObserver(recalculateScrollbar);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && scrollbarRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = containerRef.current.scrollHeight;
        const scrollTop = containerRef.current.scrollTop;
        const scrollbarTop = (scrollTop / contentHeight) * containerHeight;
        scrollbarRef.current.style.top = `${scrollbarTop}px`;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="scrollbar-container relative h-screen overflow-hidden">
      <div className="scrollbar-content " ref={containerRef}>
        {children}
      </div>
      <div
        className="scrollbar absolute right-0 top-0 w-1 z-0 bg-purple-600 rounded transition-all cursor-pointer hidden my-1"
        ref={scrollbarRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          setStartY(e.clientY);
          setStartTop(scrollbarRef.current?.offsetTop || 0);
          document.body.classList.add('no-select');
          scrollbarRef.current?.classList.add('dragging');
        }}
      ></div>
    </div>
  );
};

export default ScrollBar;
