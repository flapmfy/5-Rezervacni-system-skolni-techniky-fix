import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';

createInertiaApp({
  title: (title) => `${title} - ToolBox`,
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    let page = pages[`./Pages/${name}.jsx`];
    page.default.layout =
      page.default.layout ||
      ((page) => {
        const user = page.props.auth.user;

        if (user.isAdmin) {
          return <AdminLayout children={page} />;
        } else {
          return <UserLayout children={page} />;
        }
      });
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
