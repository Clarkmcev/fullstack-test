import Layout from "./Layout";

interface Props {
  label?: string;
}

function Loader({ label }: Props) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Loader;
