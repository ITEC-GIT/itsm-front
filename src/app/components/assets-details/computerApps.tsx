import { ComputerSoftwaresComponent } from "./computerSoftwares";

const ComputerAppsComponent = ({ computerId }: { computerId: number }) => {
  return <ComputerSoftwaresComponent computerId={computerId} />;
};

export { ComputerAppsComponent };
