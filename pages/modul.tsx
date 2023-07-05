import type { NextPage } from 'next'
import { useContext } from 'react'
import Button from '../components/Button'
import Page from '../components/Page'
import PageInfo from '../components/PageInfo'
import YearContext from '../util/YearContext'
import { PageText } from '@prisma/client'
import { prisma } from '../prisma/prismaclient'

export const getServerSideProps = async () => {

  const text = await prisma.pageText.findFirst({
    where: {
      page: "modul"
    }
  })

  return {
    props: { text: text }
  }
}

interface ModulPageProps {
  text: PageText
}

const Modul: NextPage<ModulPageProps> = ({ text }) => {

  const ctx = useContext(YearContext)

  return (
    <>
      <Page blackout>
        <PageInfo heading="Nollmodulen">
          {text.content}
        </PageInfo>
        <Button action={() => {location.href="/modul/" + ctx.year + ".pdf"}}>
          Här hittar du årets modul
        </Button>
      </Page>
    </>
  )
}

export default Modul