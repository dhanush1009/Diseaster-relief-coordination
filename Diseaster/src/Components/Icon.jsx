import { FaMapMarkerAlt, FaHeart, FaCheckCircle } from 'react-icons/fa';

export default function Example() {
  return (
    <div>
      <h4><FaHeart /> Medical Aid</h4>
      <p><FaMapMarkerAlt /> Downtown, Zone A</p>
      <p>Status: <FaCheckCircle color="green" /> Completed</p>
    </div>
  );
}
