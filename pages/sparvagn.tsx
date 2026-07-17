import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { prisma } from "../prisma/prismaclient";
import { Poi } from "@prisma/client";

const SparvagnMap = dynamic(() => import("../components/sparvagn/SparvagnMap"), {
  ssr: false
});


export const getServerSideProps = async () => {
  const poi = await prisma.poi.findMany();
  return { props: { poi: JSON.parse(JSON.stringify(poi)) } };
}

interface SparvagnPageProps {
  poi: Poi[];
}

const SparvagnPage: NextPage<SparvagnPageProps> = ({ poi }) => {

    // console.log("Rendering SparvagnPage");

  return (
    <>
      <Head>
        <title>Spårvagnssafari</title>
      </Head>
      <SparvagnMap poi={poi} />
    </>
  );
};

export default SparvagnPage;
