import { Anchor } from "@mantine/core";

const HelpfulDocuments = () => {
  return (
    <div className="space-y-5">
      <div className="page-title">
        <div className="lg:h2 md:h3 sm:h4">Helpful Documents</div>
      </div>
      <div className="card space-y-6">
        <div className="border border-grey-low rounded-xl px-6 py-9 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/pdf-icon.png"
              alt="Wellness Logo"
              className="overflow-hidden shrink-0"
            />
            <h6 className="text-foreground">Getting Started with Telehealth: A Patient’s Guide</h6>
          </div>
          <Anchor
            underline="always"
            fw={500}
            ms={10}
            target="_blank"
            href="https://devdocmedilink.epiqscripts.com/system_files/Wellness%20Plus%20Training%20Material.pdf"
            classNames={{
              root: "text-xl font-bold",
            }}
          >
            Download
          </Anchor>
        </div>
      </div>
    </div>
  );
};

export default HelpfulDocuments;
