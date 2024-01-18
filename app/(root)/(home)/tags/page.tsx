import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/filters/Filters";
import { TagFilters, UserFilters } from "@/constants/filters";
import React from "react";
import { getAllTags } from "@/lib/actions/tag.action";
import TagCard from "@/components/shared/cards/TagCard";

const page = async () => {
  //get all users from mongodb

  const tags = await getAllTags({});

  return (
    <div>
      <h1 className="h1-bold">Tags</h1>
      <div className="mt-[30px] gap-3 sm:flex">
        <LocalSearch
          route="community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by Tags"
          otherClasses="flex-1 min-h-[56px]"
        />
        <Filters
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] max-sm:mt-2"
          containerClasses=""
        />
      </div>
      <section className="w-full flex flex-row flex-wrap gap-2 mt-7">
        {tags.map((tag) => {
          return <TagCard key={tag._id} tag={tag} />;
        })}
      </section>
    </div>
  );
};

export default page;
