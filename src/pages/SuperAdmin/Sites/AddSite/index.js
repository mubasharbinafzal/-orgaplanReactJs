import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../../globals";
import AddSiteStep1 from "./AddSiteStep1";
import AddSiteStep2 from "./AddSiteStep2";
import AddSiteStep3 from "./AddSiteStep3";
import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function AddSite(props) {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");
  const [step2SubmittedData, setStep2SubmittedData] = useState("");
  const history = useHistory();
  const prevstep = usePrevious(step);
  // Hook
  function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }

  if (prevstep === 3) {
    Object.keys(step2Data.data).map((key) => {
      if (key === "_id") {
        history.push(`/sites/edit-site/${step2Data.data[key]}`);
      }
    });
  }
  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="CREATE A SITE" />
      <Stepper
        disabled
        step={step}
        setStep={setStep}
        steps={["Step 1: General Information", "Step 2: Dates", "Text 1: PIC"]}
      />
      <div className={classes.content}>
        {step === 1 ? (
          <AddSiteStep1
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            step2SubmittedData={step2SubmittedData}
            setStep2SubmittedData={setStep2SubmittedData}
          />
        ) : step === 2 && step1Data !== "" ? (
          <AddSiteStep2
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            step2SubmittedData={step2SubmittedData}
            setStep2SubmittedData={setStep2SubmittedData}
          />
        ) : step === 3 && step1Data !== "" && step2Data !== "" ? (
          <AddSiteStep3
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            step2SubmittedData={step2SubmittedData}
            setStep2SubmittedData={setStep2SubmittedData}
          />
        ) : (
          <>{setStep(prevstep)}</>
        )}
      </div>
    </div>
  );
}
