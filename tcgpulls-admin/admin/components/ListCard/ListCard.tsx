import { Text } from "@keystone-ui/core";
import React from "react";
import { ListMeta } from "@keystone-6/core/types";
import CustomLink from "../CustomLink";

type Props = {
  list: ListMeta;
};

const ListCard = ({ list }: Props) => {
  if (!list) {
    return null;
  }

  return (
    <div className={`rounded-xl bg-gray-100`}>
      <CustomLink
        className={`text-black font-semibold block p-4`}
        href={`/${list.path}`}
      >
        {list.label}
      </CustomLink>
      <Text>{list.description}</Text>
    </div>
  );
};

export default ListCard;
