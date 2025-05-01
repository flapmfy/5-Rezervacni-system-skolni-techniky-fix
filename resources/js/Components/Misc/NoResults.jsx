const NoResults = ({ message }) => {
  return (
    <div className="my-4 flex min-h-[250px] items-center justify-center rounded border-2 border-dashed p-4 text-center dark:border-gray-500">
      <p className="fluid-text-1 select-none text-gray-400">{message}</p>
    </div>
  );
};

export default NoResults;
