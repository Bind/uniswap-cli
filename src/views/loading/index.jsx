import React, { useRef } from "react";
export default () => {
  return (
    <Box
      ref={ref}
      flexGrow={1}
      width={"100"}
      alignItems="center"
      justifyContent="center"
    >
      <Text>Loading...</Text>
      <LogoComponent height={128} width={128} />
    </Box>
  );
};
