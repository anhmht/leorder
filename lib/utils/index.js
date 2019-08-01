export const autoFillCharacter = (lastestUnique, ENTITY_PREFIX, numberLength = 3) => {
  const string = lastestUnique.replace(ENTITY_PREFIX, '');
  const nextNumber = (Number(string) + 1).toString();
  return `${ENTITY_PREFIX}${(`00000000000${nextNumber}`).slice(-numberLength)}`;
};
