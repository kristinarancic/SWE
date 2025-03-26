import { useState, useEffect } from 'react';
import './Slider.css';
import { Images } from './Images';

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === Images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className='slider'>
      <div className='slider-image-container'>
        <img
          src={Images[activeIndex].url}
          alt={Images[activeIndex].alt}
          className='slider-image'
        />
        <div className='slider-dots'>
          {Images.map((image, index) => (
            <span
              key={image.id}
              className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
