const ProfileIcon = ({ username }) => {
  const letters = username
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-gray-200 text-xl dark:bg-gray-500">
      {letters}
    </div>
  );
};

export default ProfileIcon;
