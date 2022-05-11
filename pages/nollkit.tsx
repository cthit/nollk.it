import type { NextPage } from 'next'
import Head from 'next/head'
import Page from '../components/Page'

interface NollkitMember {
  name: string,
  role: string,
  greeting: string,
  text: string
}

const Nollkit: NextPage = () => {

  const nollkit: NollkitMember[] = [
    {
      name: 'Daði "Klakinn" Andrason', 
      role: "Eventchef",
      greeting: "Sup Nollan!",
      text: `Det är jag som är Klakinn, NolllKITs Eventchef. En gång på bodde jag på Island men är sedan länge en trogen Göteborgare. Som Evenchef ansvarar jag för alla lokaler, all mat och alla andra bokningar som görs under mottagningen.
      Jag hoppas ni ser fram emot mottagningens fyra veckor lika mycket som jag! Vi ses om ett tag Nollan!`
    },
    {
      name: 'Clara "Champis" Simonsson', 
      role: "Ordförande",
      greeting: "Hejsan svejsan!",
      text: `Mitt namn är Champis och jag är big boss i NollKIT. Jag kommer i från Smålands hjärta, Vrigstad. Mitt jobb är att överse hela vår verksamhet och se till att det som behöver göras blir gjort. Jag är även en höjdare på att skriva mötesdagordningar.`
    },
    {
      name: 'Jacob "Drake" Bengtsson', 
      role: "PR-chef",
      greeting: "Tjo bre!",
      text: `Jag heter Drake och är PR-chef i NollKIT. Det betyder att det är jag som har den coolaste hatten och gör de ballaste tricken på min sparkcykel. Ni hittar mig ofta med en kamera eller två till hands när jag försöker fånga varenda litet ögonblick av det spektakel som kallas mottagningen. Ses där!`
    },
    {
      name: 'Julia "Bieber" Böckert', 
      role: "Phadderchef",
      greeting: "Hojhoj!!",
      text: `Bieber heter jag och jag är NollKITs alldeles egna Phadderchef! Jag har delat in er i era phaddergrupper och har även sett till att alla dessa phaddergrupper har phaddrar som kommer ta hand om er under mottagningen. När jag inte uttalar grejer fel så är jag professionel borttappare av saker på heltid. #biebermoment`
    },
    {
      name: 'Erik "Knuten" Henriksson', 
      role: "Vice ordförande",
      greeting: "Hallå eller?!",
      text: `Jag är Knuten och här i krokarna agerar jag som Vice ordförande. Mitt främsta arbete är att göra mottagningen så billig som möjligt för er genom att leta reda på företag som vill sponsra mottagningen. Mig känner ni lätt igen på mitt fina turkosa skägg.`
    }
  ]


  return (
    <>
      <Head>
        <title>Vi är NollKIT</title>
        <meta name="description" content="Vi är NollKIT" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Page blackout>
        <div className="absolute w-full flex flex-col items-center top-60 overflow-hidden">
          <div className="w-1/2 flex flex-col">
            <div className="w-full flex flex-col items-center mb-60"> 
              <div className="font-po text-6xl mb-6">Vi är NollKIT</div>
              <div className="w-1/2 font-light text-justify">
                Hej du Nollan! När du tar dina första steg in på Chalmers är det vi åtta som har planerat fyra veckor med aktiviteter och arrangemang allt för att du ska lära känna din klass bättre och kunna få reda på vad Chalmers som skola har att erbjuda. 
                <br/><br/>
                För att hela denna resan ska gå runt har vi lite olika ansvarsområden som kan läsa om nedan. Vi ser framåt att träffa er alla i augusti!
              </div>
            </div>

            <div>
              {
                nollkit.map( (n, i) => {
                  if (i % 2 === 0 ) {
                    return (
                      <div key={n.role} className="w-full grid grid-cols-5 gap-5 mb-8">
                        <div className={`col-span-2 bg-cover bg-top aspect-[4/5]`} style={{backgroundImage: `url('/bilder/nollkit/${n.role}.jpg`}}></div>
                        <NollkitDesc {...n} />
                      </div>
                    )
                  } else {
                    return (
                      <div key={n.role} className="w-full grid grid-cols-5 gap-5 mb-8">
                        <NollkitDesc {...n} />
                        <div className={`col-span-2 bg-cover bg-top aspect-[4/5]`} style={{backgroundImage: `url('/bilder/nollkit/${n.role}.jpg`}}></div>
                      </div>
                    )
                  }
                })
              }
            </div>

          </div>
        </div>  
      </Page>
    </>
  )
}

export default Nollkit

function NollkitDesc(props: NollkitMember) {
  return (
    <div className="w-full flex flex-col col-span-3">
      <div className="font-po text-4xl">{props.name}</div>
      <div className="text-2xl font-medium italic mb-3">{props.role}</div>
      <div className="font-light italic mb-1">{props.greeting}</div>
      <div className="font-light">{props.text}</div>
    </div>
  )
}