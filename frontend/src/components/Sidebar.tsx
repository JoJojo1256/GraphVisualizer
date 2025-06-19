import { useProofStore } from "../store/proofStore";

const Sidebar = () => {
  const { currentProof } = useProofStore();

  if (!currentProof) {
    return null;
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div
        className="h-full flex flex-col border-2 border-gray-700 rounded-md bg-gray-800 shadow-sm mx-auto w-full"
        style={{ borderRadius: "0.5rem" }}
      >
        {/* Proof Title Section */}
        <div className="text-center mt-10">
          <h3 className="text-3xl font-bold text-gray-100 mb-4">
            {currentProof.title}
          </h3>
          <div className="mx-auto px-20">
            <div className="w-[75%] mx-auto text-center">
              <p className="text-base text-gray-300">
                {currentProof.description}
              </p>
            </div>
          </div>
        </div>

        {/* Written Proof Section */}
        <div className="overflow-y-auto px-10 py-6">
          <div className="mx-auto">
            <h4 className="font-bold text-gray-100 mb-8 text-2xl text-center">
              Complete Proof
            </h4>

            {/* Proof content with border */}
            <div className="border border-gray-700 rounded-xl bg-gray-900 w-[95%] mx-auto">
              <div className="w-[95%] mx-auto text-justify ml-5 mr-5 my-5">
                {currentProof.full_proof ? (
                  <p className="text-gray-300 mb-0 font-medium leading-relaxed whitespace-pre-line">
                    {currentProof.full_proof}
                  </p>
                ) : (
                  <>
                    <p className="text-gray-300 mb-6 font-medium leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-300 mb-6 font-medium leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="text-gray-300 mb-0 font-medium leading-relaxed">
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem accusantium doloremque laudantium, totam rem
                      aperiam, eaque ipsa quae ab illo inventore veritatis et
                      quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
