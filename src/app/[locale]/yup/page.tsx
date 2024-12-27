'use client';

import { useState } from 'react';

import { Input } from 'postcss';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

import { TestYupItem } from './TestValidator';
import YupValidator from './YupValidator';
import { schemaInfo, SchemaInfoKey } from './schema';

export default function YupPage() {
  const [selectedSchema, setSelectedSchema] = useState<SchemaInfoKey>('email');
  const [isTest, setIsTest] = useState(false);

  return (
    <div className="grid grid-cols-[400px_1fr] gap-4">
      <Button onClick={() => setIsTest(!isTest)}>test mode</Button>
      <div />
      {isTest ? (
        <ScrollArea className="h-full">
          <YupItem title="test" desc="test" />
        </ScrollArea>
      ) : (
        <ScrollArea className="">
          {Object.entries(schemaInfo).map(([key, value]) => (
            <button key={key} onClick={() => setSelectedSchema(key as SchemaInfoKey)} className="w-full">
              <YupItem title={value.title} desc={value.desc} />
            </button>
          ))}
        </ScrollArea>
      )}

      {isTest ? <TestYupItem /> : <YupValidator schema={schemaInfo[selectedSchema]} key={selectedSchema} />}
    </div>
  );
}

function YupItem(props: { title: string; desc?: string }) {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      {props.desc && (
        <CardContent>
          <div>{props.desc}</div>
        </CardContent>
      )}
    </Card>
  );
}
