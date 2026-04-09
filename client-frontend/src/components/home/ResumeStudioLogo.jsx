const ResumeStudioLogo = ({ width = 400, height = 40 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 260 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ResumeStudio logo"
      role="img"
    >
      {/* Logo Icon */}
      <path
        d="M6 11L18 18L30 11M6 33V15L18 22L30 15V33
           C30 34.1 29.1 35 28 35H8
           C6.9 35 6 34.1 6 33Z"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text */}
      <text
        x="46"
        y="29"
        fontSize="27"
        fontWeight="600"
        fill="#FFFFFF"
        fontFamily="Inter, Poppins, Segoe UI, sans-serif"
        letterSpacing="0.4px"
      >
        ResumeStudio
      </text>
    </svg>
  );
};

export default ResumeStudioLogo;
