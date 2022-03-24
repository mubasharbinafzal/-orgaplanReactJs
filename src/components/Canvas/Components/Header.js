import React from "react";
import { Elements, LevelElements } from "./data";
import FormSelect from "../../FormSelect";

export default function Header({
  handleElementChange,
  meanCheck,
  image,
  level,
}) {
  return (
    <div className=" mr-auto text-center ">
      <div className="row pr-4 pt-2">
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3" />
        <div className="col-lg-3">
          <FormSelect
            value={meanCheck}
            name={"levelId"}
            values={level ? LevelElements : Elements}
            placeholder="Add an Element"
            onChange={handleElementChange}
            disabled={image == null ? true : false}
          />
        </div>
      </div>
    </div>
  );
}
