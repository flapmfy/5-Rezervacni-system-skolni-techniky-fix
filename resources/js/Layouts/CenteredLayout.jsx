import FlashMessages from '@/Components/FlashMessages';
const BaseLayout = ({ children }) => {
  return (
    <div className="flex-center">
      <main>
        <FlashMessages />
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;
