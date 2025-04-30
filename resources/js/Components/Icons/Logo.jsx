const Logo = ({ className }) => {
  return (
    <svg
      className={`${className} aspect-square w-full transition duration-150 ease-out hover:fill-green-700 dark:fill-white-50`}
      viewBox="0 0 800 800"
      version="1.1"
      id="svg1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="layer1" transform="matrix(1.3001017,0,0,1.3001017,-132.34016,-113.88014)">
        <path
          style={{ strokeWidth: 0.264999, strokeDasharray: 'none' }}
          d="M 119.48308,529.69381 400.24446,404.0234 399.8061,110.66838 119.57387,228.72683 Z"
          id="path3"
        />
        <path
          style={{ strokeWidth: 0.264999, strokeDasharray: 'none' }}
          d="M 699.84359,530.75214 419.0822,403.49423 418.9914,110.66837 699.7528,229.78516 Z"
          id="path4"
        />
        <path
          style={{ strokeWidth: 0.264999, strokeDasharray: 'none' }}
          d="M 120.12084,550.33332 410.10416,684.21249 700.61665,550.33333 410.10416,419.09999 Z"
          id="path5"
        />
      </g>
    </svg>
  );
};

export default Logo;
