import React from 'react';

import { Github, Mail, Globe, StickyNote } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';

function MakerContact() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-black-900 mb-4 text-4xl font-bold">MAKER CONTACT</h1>
          <p className="text-lg text-gray-300">Feedback and suggestions for improvement are welcome!</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://avatars.githubusercontent.com/u/49177223?v=4" alt="Sumi Byun" />
                <AvatarFallback>sumi</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <CardTitle className="mb-2 text-2xl">Sumi Byun</CardTitle>
                <CardDescription className="mb-3 text-lg">Fronted Engineer</CardDescription>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {/* <Badge variant="secondary">Frontend</Badge> */}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://github.com/sumi-0011" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://velog.io/@sumi-0011/posts" target="_blank" rel="noopener noreferrer">
                      <StickyNote className="mr-2 h-4 w-4" />
                      Blog
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:alex@example.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://portfolio.ssumi.space/" target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Portfolio
                    </a>
                  </Button>

                  {/* <Button variant="outline" className="w-full" asChild>
                    <a href="https://buymeacoffee.com/alexmitchell" target="_blank" rel="noopener noreferrer">
                      <Coffee className="mr-2 h-4 w-4" />
                      Support
                    </a>
                  </Button> */}
                </div>
              </div>

              {/* Collaboration CTA */}
              <div className="rounded-lg border p-6">
                <h2 className="mb-2 text-lg font-medium">Open for Collaboration</h2>
                <p className="mb-4 text-gray-300">
                  Whether you&apos;re interested in collaborating on a project, have questions about my work, or just
                  want to connect, I&apos;m always open to new opportunities and conversations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MakerContact;
