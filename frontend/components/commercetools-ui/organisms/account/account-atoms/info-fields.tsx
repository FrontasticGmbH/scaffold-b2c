import { FC } from 'react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { InfoField } from './info-card';

type InfoFieldsProps = {
  fields: Array<InfoField>;
};

const InfoFields: FC<InfoFieldsProps> = ({ fields }) => {
  return (
    <div className="grid gap-24">
      {fields?.map(({ label, value }, index) => {
        return value ? (
          <div key={index} className="grid gap-12">
            <Typography className="text-14 font-medium leading-loose text-primary">{label}</Typography>
            <Typography className="text-14 leading-loose text-primary">{value}</Typography>
          </div>
        ) : (
          <div key={index}></div>
        );
      })}
    </div>
  );
};

export default InfoFields;
