import FlashMessages from '@/Components/FlashMessages';
const NoLayout = ({ children }) => {
  return (
    <main>
      <FlashMessages />
      {children}
    </main>
  );
};

export default NoLayout;
