import { useRef, useEffect } from 'react';
import './imagecompare.css';

interface Props {
  image1: string;
  image2: string;
}

const ImageCompareSliderFancy: React.FC<Props> = ({ image1, image2 }) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const reveal = revealRef.current;
    const dragLine = lineRef.current;

    if (!slider || !reveal || !dragLine) return;

    const updateSlider = () => {
      const val = slider.value;
      reveal.style.width = `${val}%`;
      dragLine.style.left = `${val}%`;
      dragLine.style.transform = 'translate(-50%, -50%)';
    };

    // Initial sync
    updateSlider();

    slider.addEventListener('input', updateSlider);

    let isDragging = false;

    const startDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging = true;
    };

    const stopDrag = () => {
      isDragging = false;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !slider) return;

      const rect = slider.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      slider.value = percent.toString();
      updateSlider();
    };

    dragLine.addEventListener('mousedown', startDrag);
    dragLine.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    return () => {
      slider.removeEventListener('input', updateSlider);
      dragLine.removeEventListener('mousedown', startDrag);
      dragLine.removeEventListener('touchstart', startDrag);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, []);

  return (
    <div className="wrapper">
      <div className="images">
        <div className="img-1" style={{ backgroundImage: `url(${image1})` }}></div>
        <div className="img-2-wrapper" ref={revealRef}>
          <div className="img-2" style={{ backgroundImage: `url(${image2})` }}></div>
        </div>
      </div>

      <div className="slider">
        <input type="range" min="0" max="100" defaultValue="50" ref={sliderRef} />
        <div className="drag-line" ref={lineRef}>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default ImageCompareSliderFancy;
