import {
  NavigationContainer,
  NavItem,
  ListNavItems,
} from "@keystone-6/core/admin-ui/components";
import type { NavigationProps } from "@keystone-6/core/admin-ui/components";
import { Box, Heading } from "@keystone-ui/core";
import React from "react";
import { displayedLists } from "../config";

const CustomNavigation = ({ lists, authenticatedItem }: NavigationProps) => {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <Box paddingBottom="xlarge">
        <NavItem href="/dashboard">Dashboard</NavItem>
      </Box>
      <Box paddingBottom="xlarge">
        {displayedLists.map((group) => (
          <Box key={group.key} paddingBottom="xlarge">
            <Heading type="h4" paddingLeft="xlarge" paddingBottom="medium">
              {group.label}
            </Heading>
            <ListNavItems
              lists={lists.filter((list) => group.lists.includes(list.key))}
            />
          </Box>
        ))}
      </Box>
    </NavigationContainer>
  );
};

export default CustomNavigation;
