import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

export default function InterestRateTrigger() {
  const [loading, setLoading] = useState(false);

  const submitInterestRateDaily = () => {
    if (
      !formData?.businessDate ||
      !formData?.fedCloseTime ||
      !formData?.interestRate ||
      !formData?.fedClosingBalance
    ) {
      console.error("The data has not been selected");
      return;
    }

    setLoading(true); // show spinner

    FetchWithAuthentication(`${backEndBaseURL}/interest/daily/re-trigger`, {
      method: "POST",
      body: JSON.stringify({
        businessDate: formData.businessDate,
        fedCloseTime: `${formData.businessDate}T${formData.fedCloseTime}`,
        rate: formData.interestRate,
        fedBalance: formData.fedClosingBalance,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); // hide spinner
        // ✅ your existing resultCode / error handling here
      })
      .catch((error) => {
        setLoading(false); // hide spinner on error too
        console.error("Fetch failed: ", error);
      });
  };

  return (
    <>
      {/* your normal page */}
      <Button onClick={submitInterestRateDaily} disabled={loading}>
        Submit
      </Button>

      {/* overlay spinner */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}