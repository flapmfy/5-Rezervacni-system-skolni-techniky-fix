import { router } from '@inertiajs/react';

const GoBackBtn = ({ children, classes }) => {
  return (
    <button onClick={() => window.history.back()} className={classes}>
      {children}
    </button>
  );
};

export default GoBackBtn;
