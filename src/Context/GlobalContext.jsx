import React, { createContext, useContext } from "react";
import { message, notification } from "antd";

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  // Provide both apis as an object
  const contextValue = {
    messageApi,
    notificationApi,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {/* Both context holders must be rendered */}
      {messageContextHolder}
      {notificationContextHolder}
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use global message & notification APIs
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  return context;
};
