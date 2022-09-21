import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ default: '' })
  levelOfStudy: string;

  @Column({ default: '' })
  expectedSalary: string;

  @Column({ default: '' })
  wilaya: string;

  @Column({ default: '' })
  biography: string;

  @Column({ default: '' })
  repoUrl: string;

  @Column({ default: '' })
  linkedInUrl: string;

  @Column({ default: '' })
  portfolio: string;
}
