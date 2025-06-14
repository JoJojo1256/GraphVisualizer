import { useProofStore } from "../store/proofStore";

const Sidebar = () => {
  const { currentProof } = useProofStore();

  if (!currentProof) {
    return null;
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="h-full flex flex-col border-2 border-gray-200 rounded-md bg-white shadow-sm max-w-2xl mx-auto w-full"
      style={{ borderRadius: "0.5rem" }}>
        {/* Proof Title Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {currentProof.title}
          </h3>
          <div className="mx-auto px-20">
            <div className="w-[75%] mx-auto text-center">
              <p className="text-base text-gray-600">
                {currentProof.description}
              </p>
            </div>
          </div>
        </div>

        {/* Written Proof Section */}
        <div className="overflow-y-auto px-10 py-6">
          <div className="max-w-xl mx-auto">
            <h4 className="font-bold text-gray-800 mb-8 text-2xl text-center">
              Complete Proof
            </h4>

            {/* Proof content with border */}
            <div className="border border-gray-300 rounded-xl bg-gray-50 w-[95%] mx-auto">
              <div className="w-[95%] mx-auto text-justify">
                <p className="text-gray-800 mb-6 font-medium leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-800 mb-6 font-medium leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p className="text-gray-800 mb-0 font-medium leading-relaxed">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
