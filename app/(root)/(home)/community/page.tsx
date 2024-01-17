import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/filters/Filters";
import { UserFilters } from "@/constants/filters";
import React from "react";
import { getAllUsers } from "@/lib/actions/user.action";
import UserCard from "@/components/shared/cards/UserCard";
import { useSearchParams } from "next/navigation";
import fetch from "node-fetch";

const page = async () => {
  //get all users from mongodb

  const users = await getAllUsers({});

  const userLength = 50;
  while (users.length < userLength) {
    users.push(users[0]);
  }

  return (
    <div>
      <h1 className="h1-bold">All Users</h1>
      <div className="mt-[30px] gap-3 sm:flex">
        <LocalSearch
          route="community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by Username"
          otherClasses="flex-1 min-h-[56px]"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] max-sm:mt-2"
          containerClasses=""
        />
      </div>
      <section className="w-full flex flex-row flex-wrap justify-left gap-2 mt-7">
        {users.map((user) => {
          return <UserCard key={user._id} user={user} />;
        })}
      </section>
    </div>
  );
};

export default page;
