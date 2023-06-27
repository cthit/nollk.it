import { Prisma } from "@prisma/client";

export type CommitteeWithMembers = Prisma.CommitteeGetPayload<{
  include: { members: true };
}>;