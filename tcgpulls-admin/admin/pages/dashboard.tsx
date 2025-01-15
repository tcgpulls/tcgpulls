import React from "react";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Box, Divider, Heading } from "@keystone-ui/core";
import { useKeystone } from "@keystone-6/core/admin-ui/context";
import { displayedLists } from "../config";
import ListCard from "../components/ListCard/ListCard";

const DashboardPage = () => {
  const { adminMeta } = useKeystone();
  const allLists = Object.values(adminMeta.lists);

  const renderListItems = (listKeys: string[]) => {
    return allLists
      .filter((list) => listKeys.includes(list.key))
      .map((list) => <ListCard list={list} key={list.key} />);
  };

  return (
    <PageContainer header={<Heading type="h3">Dashboard</Heading>}>
      <Box className={`weird-papa`} paddingY="xlarge">
        {displayedLists.map((group) => (
          <Box key={group.key}>
            <Heading type="h2" paddingBottom="large">
              {group.label}
            </Heading>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {renderListItems(group.lists)}
            </div>
            <Divider marginY="xxlarge" />
          </Box>
        ))}
      </Box>
    </PageContainer>
  );
};

export default DashboardPage;
