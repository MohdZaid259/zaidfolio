import { TextHoverEffect } from "../ui/text-hover-effect";

export const Footer = () => {
  return (
    <div className="w-full relative">
      <TextHoverEffect text="let's build" />
      <p className="absolute bottom-0 md:mb-2 max-sm:text-xs left-1/2 -translate-x-1/2 text-center w-full text-shadow-2xs shadow-black text-gray-300">&copy; Mohd Zaid {new Date().getFullYear()} Inc. All rights reserved.</p>
    </div>
  );
};
