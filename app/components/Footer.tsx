import React from "react";

function Footer() {
  return (
    <footer className="border-t">
      <div className="py-6 md:px-8 md:py-0 max-w-[1082px] mx-auto flex h-16 items-center justify-between px-8">
        <div className="container-wrapper">
          <div className="container py-4">
            <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Louis-Émile Vromet
              </a>{" "}
              with ❤️ . The source code is available on{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
