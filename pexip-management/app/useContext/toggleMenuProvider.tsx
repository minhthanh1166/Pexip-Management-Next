import React, { createContext, useContext, useState } from "react";


interface ToggleMenu {
  toggle: boolean;
  isMeetingList: boolean;
  isWorkerNodes: boolean;
  isListPeople: boolean;
  isMeetingAttendesslist: boolean;
}

interface ToggleMenuContextType {
  toggleMenu: ToggleMenu;
  setToggleMenu: React.Dispatch<React.SetStateAction<ToggleMenu>>
}


const ToggleMenuContext = createContext<ToggleMenuContextType | undefined>(undefined);


export const ToggleMenuProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [toggleMenu, setToggleMenu] = useState<ToggleMenu>({
        toggle: false,
        isMeetingList: true,
        isWorkerNodes: true,
        isListPeople: true,
        isMeetingAttendesslist: true
      });
    
   return (
    <ToggleMenuContext.Provider value={{ toggleMenu, setToggleMenu }}>
      {children}
    </ToggleMenuContext.Provider>
   )
}

export const useToggleMenu = (): ToggleMenuContextType => {
  const context = useContext(ToggleMenuContext);
  if (!context){
    throw new Error("useToggleMenu in ToggleMenuProvider")
  }
  return context;
}