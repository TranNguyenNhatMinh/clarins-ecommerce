/**
 * Thanh thông báo mỏng trên cùng
 */
import { ANNOUNCEMENT } from '../../constants/homeConfig.js';

export default function AnnouncementBar() {
  return (
    <div className="bg-gray-800 text-white text-center py-2">
      <p className="text-xs tracking-wide text-gray-200">
        {ANNOUNCEMENT.text}
      </p>
    </div>
  );
}
