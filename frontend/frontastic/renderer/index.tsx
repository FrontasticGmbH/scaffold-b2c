import React from 'react';
import { classnames } from 'helpers/utils/classnames';
import { tastics } from 'frontastic/tastics';
import Cell from './components/cell';
import Grid from './components/grid';
import TasticWrapper from './components/tastic-wrapper';
import { RendererProps } from './types';
import { highlight } from './utils/highlight';

const Renderer = ({
  data: pageData,
  params,
  searchParams,
  currentHighlight,
  gridClassName = '',
  wrapperClassName = '',
  categories = [],
}: RendererProps) => {
  const { page, data } = pageData;

  const sections = [page.sections.head, page.sections.main, page.sections.footer];

  const sectionsClassNames = {
    head: '',
    main: 'grow body-section',
    footer: '',
  } as Record<string, string>;

  return (
    <div className="flex min-h-screen flex-col items-stretch justify-start">
      {sections.filter(Boolean).map((section) => (
        <Grid
          key={section.sectionId}
          gridClassName={gridClassName}
          wrapperClassName={classnames(
            'relative w-full',
            wrapperClassName,
            highlight(currentHighlight === section.sectionId),
            sectionsClassNames[section.sectionId],
          )}
        >
          {section.layoutElements?.map((layoutElement) => (
            <Cell
              key={layoutElement.layoutElementId}
              configuration={layoutElement.configuration}
              isHighlighted={currentHighlight === layoutElement.layoutElementId}
            >
              {layoutElement.tastics.map((tastic) => (
                <TasticWrapper
                  key={tastic.tasticId}
                  data={tastic}
                  params={params}
                  searchParams={searchParams}
                  dataSources={data.dataSources}
                  tastics={tastics}
                  isHighlighted={currentHighlight === tastic.tasticId}
                  categories={categories}
                />
              ))}
            </Cell>
          ))}
        </Grid>
      ))}
    </div>
  );
};

export default Renderer;
