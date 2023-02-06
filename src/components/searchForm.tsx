import { type AO3Search, type SpaceBattlesSearch } from "../types/search";
import { useState } from "react";
import GeneralInput from "./common/GeneralInput";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
  const [AO3Data, setAO3Data] = useState<AO3Search>({});
  const [SpaceBattlesData, setSpaceBattlesData] = useState<SpaceBattlesSearch>({});
  return (
    <div className="text-white">
      <h2 className="mb-2 text-2xl">Universal</h2>
      <div className="mb-4 flex rounded border p-4">
        <GeneralInput
          formLabel="Key Words"
          name="keyWords"
          value={AO3Data.anyField || SpaceBattlesData.keyWords}
          onChange={(value) => {
            setAO3Data({ ...AO3Data, anyField: value as string });
            setSpaceBattlesData({ ...SpaceBattlesData, keyWords: value as string });
          }}
        />
        <GeneralInput
          formLabel="Tags"
          name="tags"
          value={AO3Data.tags?.join(", ") || SpaceBattlesData.tags?.join(", ")}
          onChange={(value) => {
            setAO3Data({ ...AO3Data, tags: value.split(",").map((a) => a.trim()) });
            setSpaceBattlesData({
              ...SpaceBattlesData,
              tags: value.split(",").map((a) => a.trim()),
            });
          }}
        />
      </div>
      <h2 className="mb-2 text-2xl">Space Battles</h2>
      <div className="mb-4 flex rounded border p-4">
        <GeneralInput
          formLabel="Exclude Tags"
          name="excludeTags"
          value={SpaceBattlesData.excludeTags?.join(", ")}
          onChange={(value) =>
            setSpaceBattlesData({
              ...SpaceBattlesData,
              excludeTags: value.split(",").map((a) => a.trim()),
            })
          }
        />
        <GeneralInput
          formLabel="Replies"
          name="replies"
          value={SpaceBattlesData.replies}
          onChange={(value) => setSpaceBattlesData({ ...SpaceBattlesData, replies: value as string })}
        />
        <GeneralInput
          formLabel="Users"
          name="users"
          value={SpaceBattlesData.users?.join(", ")}
          onChange={(value) =>
            setSpaceBattlesData({
              ...SpaceBattlesData,
              users: value.split(",").map((a) => a.trim()),
            })
          }
        />
      </div>
      <h2 className="mb-2 text-2xl">Archive of Our Own</h2>
      <div className="mb-4 flex rounded border p-4">
        <GeneralInput
          formLabel="Language"
          name="language"
          value={AO3Data.language}
          onChange={(value) =>
            setAO3Data({
              ...SpaceBattlesData,
              language: value as string,
            })
          }
        />
      </div>
    </div>
  );
}

export default SearchForm;
