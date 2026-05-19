import { useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Card({ time, name, description, image, link }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (link) {
      window.location.href = link;
    } else {
      toast.error('hey i really want to self host this so you can see my projects, but i have 1 day to do this web, ill add later');
    }
  };

  return (
    <div onClick={handleClick} className='project-card rounded-md border p-4 cursor-pointer mb-4'>
      <p className='text-sm'>{time}</p>
      <h3 className='font-bold'>{name}</h3>
      <p className='text-sm'>{description}</p>
      {image && (
        <div >
          {!imageLoaded && (
            <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <Skeleton height="100%" borderRadius={8} style={{ display: 'block' }} />
              </div>
            </div>
          )}
          <img 
            src={image} 
            alt={name} 
            style={{ display: imageLoaded ? 'block' : 'none', width: '100%', borderRadius: '8px' }} 
            onLoad={() => setImageLoaded(true)} 
          />
        </div>
      )}
    </div>
  );
}
