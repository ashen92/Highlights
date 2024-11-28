import Link from 'next/link';
import { HomeIcon, UserGroupIcon, Cog6ToothIcon, FlagIcon, PencilIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

// Defining the types for SidebarItem component
interface SidebarItemProps {
  href: string;
  icon: 'home' | 'user-group' | 'cog' | 'flag' | 'pencil' | 'exclamation-circle';
  text: string;
}

// Mapping icon names to their respective components
const iconMap = {
  home: <HomeIcon className="w-6 h-6" />,
  'user-group': <UserGroupIcon className="w-6 h-6" />,
  cog: <Cog6ToothIcon className="w-6 h-6" />,
  flag: <FlagIcon className="w-6 h-6" />,
  pencil: <PencilIcon className="w-6 h-6" />,
  'exclamation-circle': <ExclamationCircleIcon className="w-6 h-6" />,
};

const SidebarItem = ({ href, icon, text }: SidebarItemProps) => {
  const router = useRouter();
  // Check if the current route matches the href for active state
  const isActive = router.pathname === href;

  return (
    <li>
      <Link href={href} legacyBehavior>
        <a
          className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white' : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          {/* Icon */}
          {iconMap[icon]}
          {/* Text */}
          <span className="ml-3">{text}</span>
        </a>
      </Link>
    </li>
  );
};

export default SidebarItem;
