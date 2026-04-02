import { useNavigate } from 'react-router'
import toast from 'react-hot-toast';
export default function Card({ time, name, description, image, link }) {
  const navigate = useNavigate();
  const handleClick = () => {
    // if (link) navigate(link);
    toast.error('hey i really want to self host this so you can see my projects, but i have 1 day to do this web, ill add later')
  }
  return (
    <div onClick={handleClick} className='project-card rounded-md border p-4 cursor-pointer'>
      <p className='text-sm'>{time}</p>
      {/* bold */}
      <h3 className='font-bold'>{name}</h3>
      <p className='text-sm'>{description}</p>
      {image && <img src={image} alt={name} />}
    </div>
  )
}
