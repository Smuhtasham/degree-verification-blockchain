"use client";
import removeSession from "@/auth/removeSession";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface PropsTypes {
  ShowLogoutModel: boolean;
  setShowLogoutModel: React.Dispatch<React.SetStateAction<boolean>>;
}
const LogoutModel = ({ ShowLogoutModel, setShowLogoutModel }: PropsTypes) => {
  const [isPending, setisPending] = useState<boolean>(false);
  const router = useRouter();
  const HandleClose = () => {
    setShowLogoutModel(false);
  };
  const handleLogout = async () => {
    const result = await removeSession();
    if (result) {
      setShowLogoutModel(false);
      router.refresh();
      router.replace("/");
    } else {
    }
  };

  return (
    <div className="z-[1000000]">
      <Dialog.Root open={ShowLogoutModel} onOpenChange={setShowLogoutModel}>
        <Dialog.Overlay onClick={HandleClose} className="fixed z-[1000000] inset-0 bg-[#000] bg-opacity-70 " />
        <Dialog.Title />
        <Dialog.Content className="z-[1000000] fixed top-1/2 left-1/2 w-[80%] h-[243px] md:w-[388px] bg-white rounded-[10px]  transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col">
            <div className="flex justify-end px-2 py-2 ">
              <div onClick={HandleClose} className="cursor-pointer">
              <IoClose />
              </div>
            </div>
            <div className="text-center font-medium text-xl text-black">
              Confirm Logout
            </div>
            <div className="text-center pt-4">
              <div>Are you sure you want to log out?</div>
              <span>Any unsaved changes will be lost.</span>
            </div>
            <div className="flex gap-6 justify-center items-center pt-8">
              <div onClick={HandleClose} className="cursor-pointer">
                Cancel
              </div>

              <button
                className={`flex justify-center items-center py-2 px-6 rounded-[8px] bg-[#033773] `}
                onClick={handleLogout}
              >
                <span className="font-medium text-white">Logout</span>
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
export default LogoutModel;
