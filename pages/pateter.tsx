import { NextPage } from "next";
import Precursor from "../components/Precursor";
import { useState } from "react";
import PageInfo from "../components/PageInfo";
import { PageText } from "@prisma/client";
import Page from "../components/Page";
import Button from "../components/Button";
import { CommitteeWithMembers } from "../types";
import Divider from "../components/Divider";
import { prisma } from "../prisma/prismaclient";

export const getServerSideProps = async () => {
  const text = await prisma.pageText.findFirst({
    where: {
      page: "pateter",
    },
  });

  let allCommittees = await prisma.committee.findMany({
    include: {
      members: true,
    },
  });

  // Database entries are not necessarily in order, and needs to be sorted
  allCommittees.sort((a, b) => b.year - a.year);
  // Remove the current year from the list
  allCommittees.shift();

  return {
    props: { text: text, allCommittees: allCommittees },
  };
};

interface PateterProps {
  text: PageText;
  allCommittees: CommitteeWithMembers[];
}

const Pateter: NextPage<PateterProps> = ({ text, allCommittees }) => {
  const [showToTopButton, setShowToTopButton] = useState(false);
  const [showScrollDownButton, setShowScrollDownButton] = useState(true);

  function handleScroll() {
    const boundary = document.querySelector("#boundary");
    const pateter = document.querySelector("#pateter");

    if (!boundary) return;
    if (!pateter) return;

    setShowToTopButton(boundary.getBoundingClientRect().top <= 0);

    console.log(pateter.scrollTop);
    setShowScrollDownButton(pateter.scrollTop <= 0);
  }

  function scrollToFirst() {
    const boundary = document.querySelector("#boundary");

    if (!boundary) return;

    boundary.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Page blackout ignoreMargins>
        <div
          id="pateter"
          className="snap-y snap-mandatory flex flex-col items-center h-screen overflow-y-auto"
          onScroll={() => handleScroll()}
        >
          <div className="snap-start h-full flex flex-col items-center w-10/12 lg:w-3/4 min-h-screen">
            <PageInfo heading="Pateter">{text.content}</PageInfo>
            <Divider />
            <div
              className={`absolute bottom-10 flex flex-col gap-4 items-center cursor-pointer py-2 transition duration-700 ${
                showScrollDownButton
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => scrollToFirst()}
            >
              <p className="text-sm italic">Skrolla för pateter</p>
              <img
                className="downarrow w-10 transition opacity-60"
                src={"/down.svg"}
                alt="arrow down"
              />
            </div>
          </div>
          {/* used to to know whether user has scrolled far enough */}
          <div id="boundary"></div>{" "}
          {allCommittees.map((committee) => (
            <div key={committee.year} className="snap-start">
              <Precursor committee={committee} />
            </div>
          ))}
        </div>
      </Page>
      <div
        className={`fixed right-10 bottom-10 transition-opacity duration-300 ${
          showToTopButton
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Button
          color="bg-black/20"
          action={() => {
            document
              .querySelector("#pateter")
              ?.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Tillbaka till toppen
        </Button>
      </div>
    </>
  );
};

export default Pateter;
