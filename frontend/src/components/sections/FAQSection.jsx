import React from "react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQSection = () => {
  const { t, lang } = useLang();
  const { faqs, settings } = useContent();
  const tagline = (lang === "tr" ? settings.faq_tagline_tr : settings.faq_tagline_en) || t.faq.tagline;
  const title = (lang === "tr" ? settings.faq_title_tr : settings.faq_title_en) || t.faq.title;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 reveal">
          <p className="tagline mb-3">{tagline}</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-900">
            {title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4 reveal">
          {faqs.map((item, i) => (
            <AccordionItem
              key={item.id}
              value={`item-${i}`}
              className="border border-neutral-200 rounded-xl px-5 data-[state=open]:border-brand data-[state=open]:shadow-md transition-colors"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-neutral-900 hover:no-underline hover:text-brand py-5">
                {lang === "tr" ? item.q_tr : item.q_en || item.q_tr}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 leading-relaxed pb-5">
                {lang === "tr" ? item.a_tr : item.a_en || item.a_tr}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;

