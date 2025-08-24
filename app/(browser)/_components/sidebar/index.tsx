import React from "react";

import Wrapper from "./wrapper";
import Toggle from "./toggle";
import LinkNavigation from "./link-navigation";
import FooterSidebar from "./footer";

export const PageNavigationMenu = () => {
  return (
    <>
      <Wrapper>
        <Toggle />
        <LinkNavigation />
        <FooterSidebar />
      </Wrapper>
    </>
  );
};
