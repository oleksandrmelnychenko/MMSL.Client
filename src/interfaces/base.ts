export class EntityBase {
  constructor() {
    this.id = 0;
    this.isDeleted = false;
  }

  id: number;
  isDeleted: boolean;
}

export class EntityBaseNamed extends EntityBase {
  constructor() {
    super();

    this.name = '';
    this.description = '';
  }

  name: string;
  description: string;
}
